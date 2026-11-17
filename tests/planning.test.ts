import test from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { createCardPbInputSchema, updateCardPbInputSchema, reorderBacklogInputSchema } from '../src/dtos/input/cardPbInputDto';
import { updateCardInputSchema } from '../src/dtos/input/cardInputDto';
import { createSprintInputSchema } from '../src/dtos/input/sprintInputDto';
import { CardService } from '../src/service/cardService';
import { CardPBService } from '../src/service/cardPbService';
import { SprintService } from '../src/service/sprintService';
import { CardRepository } from '../src/repository/cardRepository';
import { CardModel } from '../src/models/Card';
import { CardPBModel } from '../src/models/CardPB';
import { SprintModel } from '../src/models/Sprint';
import { CardMapper } from '../src/mappers/cardMapper';

const groupId = new Types.ObjectId();
const userId = new Types.ObjectId().toString();
const cardId = new Types.ObjectId().toString();
const columnId = new Types.ObjectId().toString();
const sprintId = new Types.ObjectId();
const now = new Date('2026-11-13T12:00:00Z');
const groupAccess = { isMember: async () => true, isMemberAndRoleValid: async () => true };
const issue = { _id: new Types.ObjectId(cardId), groupId, title: 'Historia de prueba', description: '', sprintId: null, assignedTo: null, priority: 'media', dueDate: null, status: 'pendiente', rank: 0, storyPoints: 3, issueType: 'historia', epic: '', createdAt: now, updatedAt: now };
// Repositories are substituted at service boundaries; no development data is changed.
const substitute = <T>(value: unknown) => value as T;

test('partial backlog edits preserve unspecified fields and allow clearing assignment/date', () => {
  assert.deepEqual(updateCardPbInputSchema.parse({ title: 'Nuevo título' }), { title: 'Nuevo título' });
  assert.deepEqual(updateCardPbInputSchema.parse({ assignedTo: null, dueDate: null }), { assignedTo: null, dueDate: null });
  assert.equal(createCardPbInputSchema.safeParse({ title: 'ok', groupId: groupId.toString(), storyPoints: -1 }).success, false);
  assert.equal(reorderBacklogInputSchema.safeParse({ groupId: groupId.toString(), sprintId: null, ids: [cardId, cardId] }).success, false);
});

test('sprint creation rejects reversed dates and bypassing lifecycle', () => {
  const input = { name: 'Sprint 1', groupId: groupId.toString(), startDate: '2026-12-01', endDate: '2026-12-15' };
  assert.equal(createSprintInputSchema.safeParse(input).success, true);
  assert.equal(createSprintInputSchema.safeParse({ ...input, endDate: '2026-11-01' }).success, false);
  assert.equal(createSprintInputSchema.safeParse({ ...input, status: 'activo' }).success, false);
});

test('checklist DTO validates item-level operations and ignores forged completion timestamps', () => {
  const payload = { cardId, columnId, subtask: { action: 'toggle', id: '16fbac08-c906-4fa0-9648-48b6be9cf8e8', completed: true }, completedAt: '2000-01-01' };
  const parsed = updateCardInputSchema.parse(payload);
  assert.equal(parsed.subtask?.action, 'toggle');
  assert.equal('completedAt' in parsed, false);
  assert.equal(updateCardInputSchema.safeParse({ ...payload, subtask: { action: 'add', id: payload.subtask.id, title: '   ' } }).success, false);
});

test('checklist repository toggles one item without replacing the complete list', async t => {
  let filter: unknown; let update: unknown;
  t.mock.method(CardModel, 'updateOne', async (f: unknown, u: unknown) => { filter = f; update = u; });
  await new CardRepository().changeSubtask(cardId, { action: 'toggle', id: 'item-a', completed: true });
  assert.deepEqual(filter, { _id: cardId, 'subtasks.id': 'item-a' });
  assert.deepEqual(update, { $set: { 'subtasks.$.completed': true } });
});

test('legacy cards map to pending with an empty checklist', () => {
  const result = CardMapper.toDetailsResponse(substitute({ _id: new Types.ObjectId(cardId), title: 'Legacy', columnId: new Types.ObjectId(columnId), priority: 'media' }));
  assert.equal(result.status, 'pendiente'); assert.deepEqual(result.subtasks, []); assert.equal(result.completedAt, null);
});

test('moving a card into another board is denied before any write', async () => {
  let wrote = false;
  const cards = { getCardContext: async () => ({ groupId: groupId.toString(), boardId: 'board-a' }), update: async () => { wrote = true; } };
  const columns = { getColumnContext: async () => ({ groupId: 'another-group', boardId: 'board-b' }) };
  const service = new CardService(substitute(cards), substitute(columns), substitute({}), substitute(groupAccess), substitute({}));
  await assert.rejects(() => service.update({ cardId, columnId }, userId), /mismo tablero/);
  assert.equal(wrote, false);
});

test('assigning a card to a non-member is denied', async () => {
  let wrote = false;
  const cards = { create: async () => { wrote = true; } };
  const columns = { getColumnContext: async () => ({ groupId: groupId.toString(), boardId: 'board-a' }) };
  const service = new CardService(substitute(cards), substitute(columns), substitute({}), substitute({ ...groupAccess, isMember: async () => false }), substitute({}));
  await assert.rejects(() => service.create({ title: 'Nueva', description: '', columnId, priority: 'media', assignedTo: userId }, userId), /pertenecer al grupo/);
  assert.equal(wrote, false);
});

test('reordering rejects stale or foreign card lists', async () => {
  let wrote = false;
  const service = new CardPBService(substitute({ findBacklogByGroup: async () => [issue], reorder: async () => { wrote = true; } }), substitute(groupAccess));
  await assert.rejects(() => service.reorder(groupId.toString(), null, [new Types.ObjectId().toString()], userId), /backlog cambió/);
  assert.equal(wrote, false);
});

test('moving an issue to a sprint from another group is denied', async () => {
  let wrote = false;
  const service = new SprintService(substitute({ findById: async () => ({ groupId: new Types.ObjectId(), status: 'planificado' }) }), substitute({ findById: async () => issue, updateSprint: async () => { wrote = true; } }), substitute({}), substitute(groupAccess), substitute({}));
  await assert.rejects(() => service.moveCardToSprint({ cardId, sprintId: sprintId.toString() }, userId), /no pertenece/);
  assert.equal(wrote, false);
});

test('closing a sprint returns only unfinished issues to backlog', async t => {
  const sprint = { _id: sprintId, groupId, name: 'Sprint 1', startDate: now, endDate: now, status: 'activo', createdAt: now, updatedAt: now };
  let filter: unknown; let update: unknown;
  t.mock.method(CardPBModel, 'updateMany', async (f: unknown, u: unknown) => { filter = f; update = u; });
  const service = new SprintService(substitute({ findById: async () => sprint, update: async (_id: string, data: object) => ({ ...sprint, ...data }) }), substitute({}), substitute({}), substitute(groupAccess), substitute({}));
  const result = await service.transition(sprintId.toString(), 'completado', userId);
  assert.deepEqual(filter, { sprintId: sprintId.toString(), status: { $ne: 'completada' } });
  assert.deepEqual(update, { $set: { sprintId: null } });
  assert.equal(result.status, 'completado');
});

test('starting a sprint while another is active is rejected', async t => {
  t.mock.method(SprintModel, 'exists', async () => ({ _id: new Types.ObjectId() }));
  const service = new SprintService(substitute({ findById: async () => ({ groupId, status: 'planificado' }) }), substitute({}), substitute({}), substitute(groupAccess), substitute({}));
  await assert.rejects(() => service.transition(sprintId.toString(), 'activo', userId, columnId), /primero el sprint activo/);
});
