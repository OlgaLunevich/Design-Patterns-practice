import { Project } from './domain/project';
import { Task } from './domain/task';
import { Developer, TeamLead } from './domain/observers';
import { TaskStatus } from './domain/contracts';

const alice = new Developer('Alice');
const bob = new Developer('Bob');
const lead = new TeamLead('Eve');

const root = new Project('p1', 'Team Platform');

root.attach(alice);
root.attach(bob);
root.attach(lead);

const epicAuth = new Project('ep1', 'Auth Epic');
const jwt = new Task('t1', 'Сделать JWT');
const refresh = new Task('t2', 'Refresh token');

root.add(epicAuth);
epicAuth.add(jwt);
epicAuth.add(refresh);

root.print();

jwt.setAssignee('Alice');
jwt.setStatus(TaskStatus.InProgress);
jwt.setStatus(TaskStatus.Done);

refresh.setAssignee('Bob');
refresh.setStatus(TaskStatus.InProgress);

jwt.setTitle('Сделать JWT + роли');
epicAuth.remove('t2');
root.print();

console.log('Дочерние элементы корневого проекта:');
root.getChildren().forEach((c) => {
  console.log(` - ${c.getTitle()} (${c.getStatus()})`);
});
console.log('Итоговый прогресс root:', root.getProgress(), '%');
