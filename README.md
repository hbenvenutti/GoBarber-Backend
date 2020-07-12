# Recuperação de Senha

**Requisitos Funcionais**

- O usuário deve poder recuperar a senha fornecendo o seu endereço de email.
- O usuário deve receber um email com instruções de recuperação de senha.
- O usuário de poder alterar a sua senha.

**Requisitos Não Funcionais**


- Mailtrap para testar o envio de emails em ambiente "dev".
- Amazon SES para envio de email em produção.
- O envio de emails deve acontecer em segundo plano.

**Regra de Negócio**

- O link enviado por email deve expirar em 2 horas.
- O usuário precisa confirmar a sua nova senha ao alterá-la.

# Atualização de Perfil

**Requisitos Funcionais**

- O usuário deve poder alterar seu nome, email, senha e avatar.

**Regra de Negócio**

- O usuário não pode alterar o seu email para um email já cadastrado por outro usuário.
- Ao alterar a senha, o usuário deve fornecer a senha atual.
- Ao alterar a senha, o usuário deve confirmar a nova senha.

# Painel do Prestador

**Requisitos Funcionais**

- O usuário deve poder listar todos os seus agendamentos agrupados por dia;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**Requisitos Não Funcionais**

- Os agendamentos devem ser salvos em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;

**Regra de Negócio**

- A notificação deve ter status de lida ou não-lida;

# Agendamento de Serviços

**Requisitos Funcionais**

- O usuário deve poder listar todos os prestadores de serviço cadastrados.
- O usuário deve poder listar os dias de um mês que tenham algum horário disponível.
- O usuário deve poder realizar um novo agendamento com algum prestador de serviço.

**Requisitos Não Funcionais**
- A listagem de prestadores deve ser armazenada em cache.

**Regra de Negócio**

- Cada agendamento deve ter duração de uma hora;
- Os agendamentos devem estar disponíveis entre as 8h e 18h (1º às 8h, último às 17h);
- O usuário nao deve poder agendar em um horário já agendado;
- O usuário não deve poder agendar um horário passado;
- O usuário não deve poder agendar horários consigo mesmo;
