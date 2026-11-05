// Starting values only: the owner must check these against the real garments before launch.
export const SIZE_GUIDE = {
  baby: {
    label: "Baby",
    columns: ["Size", "Height (in)", "Chest (in)"],
    rows: [
      ["0-6M", "24-27", "16-17"],
      ["6-12M", "27-30", "17-18"],
      ["1-2Y", "30-34", "18-20"],
    ],
  },
  kids: {
    label: "Kids",
    columns: ["Size", "Height (in)", "Chest (in)"],
    rows: [
      ["2-4Y", "34-41", "20-22"],
      ["4-6Y", "41-46", "22-24"],
      ["6-8Y", "46-51", "24-26"],
      ["8-10Y", "51-56", "26-28"],
    ],
  },
  adult: {
    label: "Adult",
    columns: ["Size", "Bust (in)", "Waist (in)"],
    rows: [
      ["S", "32-34", "26-28"],
      ["M", "34-36", "28-30"],
      ["L", "36-38", "30-32"],
      ["XL", "38-40", "32-34"],
    ],
  },
};
