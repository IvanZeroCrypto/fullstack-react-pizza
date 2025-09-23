export class TokenDto {
  accessToken;

  constructor(model) {
    this.accessToken = model.accessToken;
  }
}
