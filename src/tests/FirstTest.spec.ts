import { User } from '@models/User'

test('should be ok', () => {
  const user = new User()

  user.nome = 'Thiago'

  expect(user.nome).toEqual('Thiago')
})
