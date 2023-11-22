import { NextFunction, Request, Response } from 'express';

class HttpComposer {
  private response: Response;

  constructor(res: Response) {
    this.response = res;
  }

  private send(status: number, payload: any) {
    this.response.status(status).json(payload);
  }

  public ok(payload: any) {
    this.send(200, { data: payload });
  }

  public badRequest(payload: any) {
    this.send(400, { error: payload });
  }

  public unauthorized(payload: any) {
    this.send(401, { error: payload });
  }
}

export interface CustomResponse extends Response {
  composer: HttpComposer;
}

export function applyHttpComposer(req: Request, res: CustomResponse, next: NextFunction) {
  res.composer = new HttpComposer(res);
  next();
}
