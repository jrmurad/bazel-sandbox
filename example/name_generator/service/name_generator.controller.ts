import { Controller } from "@nestjs/common";
import faker from "faker";
import { Observable, of } from "rxjs";
import { GetRandomNameResponse } from "unity/example/name_generator/proto/v1/name_generator";
import {
  NameGeneratorServiceController,
  NameGeneratorServiceControllerMethods,
} from "unity/example/name_generator/proto/v1/name_generator_service";

@Controller()
@NameGeneratorServiceControllerMethods()
export class NameGeneratorController implements NameGeneratorServiceController {
  getRandomName(): Observable<GetRandomNameResponse> {
    return of({
      name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
    });
  }
}
