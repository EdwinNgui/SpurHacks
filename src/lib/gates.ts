import { Complex } from "@/lib/types";

const SQRT1_2 = 1 / Math.sqrt(2);

export const hGate: Complex[][] = [
  [
    [SQRT1_2, 0],
    [SQRT1_2, 0],
  ],
  [
    [SQRT1_2, 0],
    [-SQRT1_2, 0],
  ],
];

export const xGate: Complex[][] = [
  [
    [0, 0],
    [1, 0],
  ],
  [
    [1, 0],
    [0, 0],
  ],
];

export const zGate: Complex[][] = [
  [
    [1, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [-1, 0],
  ],
];

export const cnotGate: Complex[][] = [
  [
    [1, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [1, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [1, 0],
    [0, 0],
  ],
];

// TODO: decide if theta should be adjustable here or hardcoded
export function ryGate(theta: number): Complex[][] {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return [
    [
      [cos, 0],
      [-sin, 0],
    ],
    [
      [sin, 0],
      [cos, 0],
    ],
  ];
}

export function rxGate(theta: number): Complex[][] {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return [
    [
      [cos, 0],
      [0, -sin],
    ], // -i·sin = [0, -sin]
    [
      [0, -sin],
      [cos, 0],
    ],
  ];
}
