export function operationTypeNormalize(input: string) {
  if (input == "Продам") {
    return "Продажа";
  } else if (input == "Сдам") {
    return "Аренда";
  } else {
    return input;
  }
}
