// api/bfhl.js

const FULL_NAME_RAW = "Gautam Singh";
const DOB = "15062004";
const EMAIL = "gautamsingh@xyz.com";
const ROLL_NUMBER = "22BSA10140";

const FULL_NAME = FULL_NAME_RAW.trim().toLowerCase().replace(/\s+/g, "_");

function alternatingCapsReverse(arr) {
  const letters = arr.join("").split("").reverse();
  return letters.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("");
}

module.exports = async (req, res) => {
  try {
    // Parse JSON body safely (Vercel handles JSON automatically, but we sanitize quotes)
    let data = req.body?.data;
    if (!data) {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      raw = raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
      data = JSON.parse(raw).data;
    }

    if (!Array.isArray(data)) {
      res.status(400).json({ is_success: false, message: "data must be an array" });
      return;
    }

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;

    data.forEach(item => {
      const str = String(item);
      if (/^\d+$/.test(str)) {
        const num = parseInt(str, 10);
        if (num % 2 === 0) even_numbers.push(str);
        else odd_numbers.push(str);
        sum += num;
      } else if (/^[a-zA-Z]+$/.test(str)) {
        alphabets.push(str.toUpperCase());
      } else {
        special_characters.push(str);
      }
    });

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string: alternatingCapsReverse(alphabets)
    });

  } catch (error) {
    res.status(500).json({ is_success: false, message: error.message });
  }
};
