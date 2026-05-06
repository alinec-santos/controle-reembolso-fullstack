// Classe de erro personalizada da aplicação.
// Permite lançar erros controlados com uma mensagem e um status HTTP específico.
// Exemplo: throw new AppError("Usuário não encontrado", 404)
export class AppError extends Error {
  public statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}