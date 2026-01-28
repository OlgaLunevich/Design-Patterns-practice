import { Project } from './domain/project';
import { Developer, TeamLead } from './domain/observers';
import { TaskStatus } from './domain/contracts';

import { BugTaskFactory } from './domain/factory/bug-task-factory';
import { FeatureTaskFactory } from './domain/factory/feature-task-factory';
import { ChoreTaskFactory } from './domain/factory/chore-task-factory';
import { TaskMetaFactory } from './domain/flyweight/task-meta-factory';

import { CommandInvoker } from './domain/command/invoker';
import { CreateTaskCommand } from './domain/command/create-task-command';
import { AddToProjectCommand } from './domain/command/add-to-project-command';
import { AssignUserCommand } from './domain/command/assign-user-command';
import { ChangeStatusCommand } from './domain/command/change-status-command';
import { RenameTaskCommand } from './domain/command/rename-task-command';

const alice = new Developer('Alice');
const bob = new Developer('Bob');
const lead = new TeamLead('Eve');

const root = new Project('p1', 'Team Platform');

root.attach(alice);
root.attach(bob);
root.attach(lead);

const epicAuth = new Project('ep1', 'Auth Epic');
const metaFactory = new TaskMetaFactory();
const bugFactory = new BugTaskFactory(metaFactory);
const featureFactory = new FeatureTaskFactory(metaFactory);
const choreFactory = new ChoreTaskFactory(metaFactory);

const jwt = featureFactory.createTask('t1', 'Сделать JWT');
const refresh = bugFactory.createTask('t2', 'Refresh token не обновляется');
const lint = choreFactory.createTask('t3', 'Настроить линтер');

root.add(epicAuth);
epicAuth.add(jwt);
epicAuth.add(refresh);
epicAuth.add(lint);

root.print();

jwt.setAssignee('Alice');
jwt.setStatus(TaskStatus.InProgress);
jwt.setStatus(TaskStatus.Done);

console.log('Итоговый прогресс root:', root.getProgress(), '%');
console.log(jwt.getKind(), jwt.getDefaultPriority(), jwt.getDefaultTags());

const bug1 = bugFactory.createTask('b1', 'Падает логин');
const bug2 = bugFactory.createTask('b2', 'Не работает refresh');

console.log('Flyweight demo:');
console.log('bug1 meta:', bug1.getMetaInfo());
console.log('bug2 meta:', bug2.getMetaInfo());
console.log('bug1 shares meta with bug2:', bug1.sharesMetaWith(bug2));

console.log('bug1 shares meta with jwt (feature):', bug1.sharesMetaWith(jwt));

const invoker = new CommandInvoker();

const createJwt = new CreateTaskCommand(featureFactory, 't10', 'Сделать JWT через Command');
invoker.run(createJwt);

const jwt2 = createJwt.getTask();

invoker.run(new AddToProjectCommand(epicAuth, jwt2));

invoker.run(new AssignUserCommand(jwt2, 'Alice'));
invoker.run(new ChangeStatusCommand(jwt2, TaskStatus.InProgress));
invoker.run(new RenameTaskCommand(jwt2, 'Сделать JWT + refresh (Command)'));
invoker.run(new ChangeStatusCommand(jwt2, TaskStatus.Done));

console.log('History size:', invoker.getHistorySize());

invoker.undoLast();

root.print();
