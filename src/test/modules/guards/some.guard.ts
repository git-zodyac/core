import { TaskServiceSchema } from "../../service/task.definition.js";
import { Guard, zRequest } from "../../../public-api.js";
import { ExampleModule } from "../first.module.js";

export class SomeGuard extends Guard<typeof TaskServiceSchema.create> {
  canPass(req: zRequest<typeof TaskServiceSchema.create>) {
    const module = this.require(ExampleModule);
    console.log(module.data, req.body.title);
    if (!module.lock) return true;
    return false;
  }
}
