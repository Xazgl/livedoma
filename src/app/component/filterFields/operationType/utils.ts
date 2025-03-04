export function operationTypeNormalize(input: string) {
  if (input == "Продам") {
    return "Купить";
  } else if (input == "Сдам") {
    return "Снять";
  } else {
    return input;
  }
}
