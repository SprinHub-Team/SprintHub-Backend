// Opt-in: uses a newly created, isolated database and removes only that database.
import 'dotenv/config';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { configureSockets } from '../src/sockets/socket';
import { services } from '../src/dependencies/serviceDependency';
import { UserModel } from '../src/models/User';
import { GroupModel } from '../src/models/Group';
import { BoardModel } from '../src/models/Board';
import { ColumnModel } from '../src/models/Column';
import { CardModel } from '../src/models/Card';
import { SprintModel } from '../src/models/Sprint';
import { CardPBModel } from '../src/models/CardPB';

async function main() {
  if (process.env.SPRINTHUB_INTEGRATION !== '1') throw new Error('Set SPRINTHUB_INTEGRATION=1 to run the isolated integration test');
  const databaseName = `sprinthub_codex_test_${Date.now()}`;
  const server = createServer(app);
  const io = configureSockets(server);
  try {
    await mongoose.connect(process.env.MONGODB_URI!, { dbName: databaseName, serverSelectionTimeoutMS: 10000 });
    await Promise.all([CardModel.init(), SprintModel.init()]);
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}/api`;
    const [user, outsider] = await UserModel.create([
      { name: 'QA Admin', email: 'qa-admin@example.test', document: 'qa-admin', passwordHash: 'test-only' },
      { name: 'QA Outside', email: 'qa-outside@example.test', document: 'qa-outside', passwordHash: 'test-only' },
    ]);
    const group = await GroupModel.create({ name: 'QA planning', members: [{ user: user._id, role: 'admin' }] });
    const board = await BoardModel.create({ title: 'QA board', groupId: group._id });
    const [todo, done] = await ColumnModel.create([{ name: 'Por hacer', boardId: board._id }, { name: 'Hecho', boardId: board._id }]);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    const outsideToken = jwt.sign({ userId: outsider.id }, process.env.JWT_SECRET!);
    async function request(path: string, method = 'GET', body?: unknown, auth = token, expected = 200) {
      const response = await fetch(base + path, { method, headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const text = await response.text();
      assert.equal(response.status, expected, `${method} ${path}: ${text}`);
      return text ? JSON.parse(text) : null;
    }
    const legacyAvatar = 'https://example.test/qa-avatar.png';
    await UserModel.collection.updateOne({ _id: user._id }, { $unset: { document: '' }, $set: { profilePicture: legacyAvatar } });
    const profile = await request('/users/me');
    assert.equal(profile.document, '');
    assert.equal(profile.profilePicture, legacyAvatar);
    const updatedProfile = await request(`/users/${user.id}`, 'PUT', { name: 'QA Admin actualizado' });
    assert.equal(updatedProfile.name, 'QA Admin actualizado');
    assert.equal(updatedProfile.document, '');
    assert.equal(updatedProfile.profilePicture, legacyAvatar);
    const groups = await request('/groups');
    assert.equal(groups.data[0].members[0].profilePicture, legacyAvatar);
    const scrumTitles = ['Backlog', 'Seleccionado para Desarrollo', 'En progreso', 'Listo'];
    const createdBoard = await request('/boards', 'POST', { groupId: group.id, title: 'QA Scrum', templateId: 'scrum' }, token, 201);
    assert.deepEqual(createdBoard.data.columns.map((column: { name: string }) => column.name), scrumTitles);
    const savedBoard = await services.board.findBoardById(createdBoard.data.id, user.id);
    assert.deepEqual(savedBoard.columns.map(column => column.name), scrumTitles);
    const historicalBoard = await BoardModel.create({ title: 'QA Scrum antiguo', groupId: group._id });
    for (const name of [...scrumTitles].reverse()) await ColumnModel.create({ name, boardId: historicalBoard._id });
    const historicalDetails = await services.board.findBoardById(historicalBoard.id, user.id);
    assert.deepEqual(historicalDetails.columns.map(column => column.name), scrumTitles);
    await request(`/reports/groups/${group.id}/statistics`, 'GET', undefined, outsideToken, 403);
    await request(`/reports/groups/${group.id}/completed`, 'GET', undefined, outsideToken, 403);
    const issue = await request('/cardPB', 'POST', { groupId: group.id, title: 'Historia QA', description: 'Criterio original', issueType: 'error', priority: 'alta', storyPoints: 8, assignedTo: user.id, dueDate: '2020-01-01' }, token, 201);
    await request(`/cardPB/${issue.id}`, 'PATCH', { title: 'Historia editada QA' });
    await request(`/cardPB/group/${group.id}/planning`, 'GET', undefined, outsideToken, 403);
    const planning = await request(`/cardPB/group/${group.id}/planning`);
    assert.equal(planning.cards[0].priority, 'alta'); assert.equal(planning.cards[0].storyPoints, 8);
    const sprint = await request('/sprints', 'POST', { groupId: group.id, name: 'Sprint QA', startDate: '2026-11-13', endDate: '2026-11-27' }, token, 201);
    await request(`/sprints/cards/${issue.id}/move`, 'PUT', { sprintId: sprint.id });
    await request(`/sprints/${sprint.id}/status`, 'PATCH', { status: 'activo', columnId: todo.id });
    assert.equal(await CardModel.countDocuments({ sourceBacklogId: issue.id }), 1);
    await request(`/sprints/cards/${issue.id}/export`, 'POST', { columnId: todo.id });
    assert.equal(await CardModel.countDocuments({ sourceBacklogId: issue.id }), 1, 'linking must not duplicate cards');
    const card = await CardModel.findOne({ sourceBacklogId: issue.id }); assert.ok(card);
    await services.card.update({ cardId: card.id, columnId: todo.id, subtask: { action: 'add', id: '16fbac08-c906-4fa0-9648-48b6be9cf8e8', title: 'Verificar QA' } }, user.id);
    const toggled = await services.card.update({ cardId: card.id, columnId: todo.id, subtask: { action: 'toggle', id: '16fbac08-c906-4fa0-9648-48b6be9cf8e8', completed: true } }, user.id);
    assert.equal(toggled.card.subtasks[0].completed, true);
    assert.equal(toggled.card.status, 'pendiente', 'checklist completion must not close the parent');
    await services.card.update({ cardId: card.id, columnId: todo.id, status: 'completada' }, user.id);
    const stillPending = await request(`/reports/groups/${group.id}`);
    assert.deepEqual(stillPending.data, { created: 1, completed: 0, pending: 1, overdue: 1 });
    await services.card.update({ cardId: card.id, columnId: done.id }, user.id);
    let { data: stats } = await request(`/reports/groups/${group.id}/statistics`);
    assert.equal(stats.totals.created, 1); assert.equal(stats.totals.completed, 1); assert.equal(stats.totals.overdue, 0);
    assert.equal(stats.users[0].completed, 1);
    const second = await request('/cardPB', 'POST', { groupId: group.id, title: 'Pendiente QA', assignedTo: user.id, dueDate: '2020-01-01' }, token, 201);
    await request(`/sprints/cards/${second.id}/move`, 'PUT', { sprintId: sprint.id });
    await request(`/sprints/${sprint.id}/status`, 'PATCH', { status: 'completado' });
    assert.equal((await CardPBModel.findById(second.id))?.sprintId, null);
    assert.equal((await CardPBModel.findById(issue.id))?.sprintId?.toString(), sprint.id);
    await request('/cardPB/reorder', 'POST', { groupId: group.id, sprintId: null, ids: [second.id] }, token, 204);
    ({ data: stats } = await request(`/reports/groups/${group.id}/statistics`));
    assert.deepEqual(stats.totals, { created: 1, completed: 1, pending: 0, overdue: 0 });
    await request(`/sprints/cards/${second.id}/export`, 'POST', { columnId: todo.id });
    ({ data: stats } = await request(`/reports/groups/${group.id}/statistics`));
    assert.deepEqual(stats.totals, { created: 2, completed: 1, pending: 1, overdue: 1 });
    await request(`/cardPB/${second.id}`, 'PATCH', { assignedTo: null, dueDate: null });
    ({ data: stats } = await request(`/reports/groups/${group.id}/statistics`));
    assert.equal(stats.unassigned.created, 1); assert.equal(stats.totals.overdue, 0);
    const groupReport = await request(`/reports/groups/${group.id}`);
    assert.deepEqual(groupReport.data, stats.totals);
    const completed = await request(`/reports/groups/${group.id}/completed`);
    assert.deepEqual(completed.data.map((activity: { id: string }) => activity.id), [card.id]);
    const personal = await request(`/reports/users/${user.id}`);
    assert.equal(personal.data.completed, 1);
    await request(`/reports/users/${user.id}`, 'GET', undefined, outsideToken, 403);
    const details = await services.board.findBoardById(board.id, user.id);
    assert.equal(details.columns.flatMap(c => c.cards).find(c => c.id === card.id)?.subtasks[0].completed, true);
    await request(`/sprints/${sprint.id}`, 'DELETE', undefined, outsideToken, 403);
    await request(`/sprints/${sprint.id}`, 'DELETE', undefined, token, 204);
    assert.equal(await SprintModel.findById(sprint.id), null);
    assert.equal((await CardPBModel.findById(issue.id))?.sprintId, null);
    assert.equal((await CardPBModel.findById(issue.id))?.status, 'completada');
    assert.equal(await CardModel.countDocuments({ sourceBacklogId: issue.id }), 1);
    console.log('PASS: isolated MongoDB + authenticated HTTP integration (legacy profile, template order, planning, sprint deletion, links, checklist, reports, permissions)');
  } finally {
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === databaseName && databaseName.startsWith('sprinthub_codex_test_')) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    io.close(); server.close();
  }
}
main().then(() => process.exit(0)).catch(error => { console.error(error instanceof Error ? error.message : 'Integration failed'); process.exit(1); });
