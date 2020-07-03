type BasicValue = number | string | boolean;
type BasicObject = {
  [key in string]: BasicValue | BasicValue[];
};

export function stringify(obj: BasicObject): string {
  const stringify = (key: string, value: BasicValue) =>
    `${key}=${encodeURIComponent(value.toString())}`;

  return Object
    .entries(obj)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((value) => stringify(`${key}[]`, value));
      }
      return stringify(key, value);
    })
    .join("&");
}

// export function parse(str: string): BasicObject {
//   return str
//     .split("&")
//     .reduce((acc, str) => {
//         const [key, val] = str.split("=")
//
//         if (key.endsWith('[]'))
//
//
//     }, {} as BasicObject);
// }
