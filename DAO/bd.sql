CREATE DATABASE bd_navegacao;

use bd_navegacao;

create table tb_Devs(
id_usuario int primary key auto_increment,
usuario_nome varchar(30),
senha varchar(20),
nome varchar(100)
); 

create table tb_Tarefas(
id_tarefa int primary key auto_increment,
id_usuario int ,
descr_tarefa varchar(10000),
dataConclusao date,
tempoExecucao varchar(30),
status varchar(30),
relevancia varchar(30),
foreign key (id_usuario)  references tb_Devs (id_usuario)
);

create table tb_Usuario(
id_users int primary key auto_increment,
nome_user varchar(20),
nome varchar(70),
senha varchar(10),
id_tarefa int,
foreign key (id_tarefa) references tb_Tarefas (id_tarefa)
);

insert into tb_Devs(id_usuario,usuario_nome,senha,nome)values 
( 1, 'admin','admin', 'Administrador'),
( 2, 'isa', '1234', 'Isabella Gomes' ),
( 3, 'geo', '1234', 'Geovanna da Silva' ),
( 4, 'agatha','1234','Agatha Lima' ),
( 5, 'jubs','1234', 'Julia Rodrigues' );

insert into tb_Tarefas(id_tarefa ,id_usuario,descr_tarefa ,dataConclusao ,tempoExecucao ,status,relevancia)values
(1,1,'Fazer projeto PAM','27/03/26','2 Semanas','Em andamento', 'Importante'),
(2,2,'Revisar conceitos de Hooks no React','20/03/26','1 hora','Pendente', 'Importância Média'),
(3,3, 'Documentar endpoints da API no Node.js','17/04/26','4 horas','Pendente', 'Importante'),
(4,4,'Estudar estequiometria para prova de Química','20/04/26','1 hora','Pendente','Importante'),
(5 ,5,'Corrigir bugs de navegação no React Native','27/03/26','1 mês','Em andamento', 'Importante'),
(6,1,'Atualizar repositórios no GitHub','10/04/26','4 horas','Pendente','Pouca Importância'),
(7, 2,'Modelar banco de dados relacional (SQL)','10/04/26','2 horas','Pendente','Pouca Importância' ),
(8,3,'Preparar relatório de aula prática de laboratório','17/04/26','3 horas','Concluído','Importante'),
( 9, 4, 'Refatorar componentes para melhorar performance','13/04/26', '2 horas','Pendente', 'Importância Média'),
(10, 5,'Assistir aula sobre Redes e Infraestrutura', '20/03/26', '1 hora','Concluído', 'Importância Média');
    
 insert into tb_Usuario(id_users,nome_user ,nome,senha,id_tarefa) values   
(1,"jdoe","João Doe","senha123",1),
(2,"mariaf","Maria Fernandes","abc456",2),
(3,"pedros","Pedro Silva","senha789",3),
( 4,"anab","Ana Beatriz","minhaSenha",4),
( 5,"lucasc", "Lucas Costa", "tarefa321",5);
 
  

