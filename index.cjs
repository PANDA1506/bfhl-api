// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();

// // Middleware: sanitize curly quotes → straight quotes
// app.use((req, res, next) => {
//   let data = "";
//   req.on("data", chunk => {
//     data += chunk;
//   });
//   req.on("end", () => {
//     if (data) {
//       // Replace curly quotes with straight quotes
//       data = data.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
//       try {
//         req.body = JSON.parse(data);
//       } catch (err) {
//         return res.status(400).json({ is_success: false, message: "Invalid JSON format" });
//       }
//     }
//     next();
//   });
// });

// const FULL_NAME = "gautam_singh";  // lowercase as per requirement
// const DOB = "15062004";
// const EMAIL = "gautamsingh@xyz.com";
// const ROLL_NUMBER = "22BSA10140";

// function alternatingCapsReverse(arr) {
//   const letters = arr.join("").split("").reverse();
//   return letters
//     .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
//     .join("");
// }

// app.post("/bfhl", (req, res) => {
//   try {
//     const data = req.body.data;
//     if (!Array.isArray(data)) {
//       return res.status(400).json({ is_success: false, message: "data must be an array" });
//     }

//     let odd_numbers = [];
//     let even_numbers = [];
//     let alphabets = [];
//     let special_characters = [];
//     let sum = 0;

//     data.forEach(item => {
//       if (/^\d+$/.test(item)) {
//         let num = parseInt(item, 10);
//         if (num % 2 === 0) {
//           even_numbers.push(item);
//         } else {
//           odd_numbers.push(item);
//         }
//         sum += num;
//       } else if (/^[a-zA-Z]+$/.test(item)) {
//         alphabets.push(item.toUpperCase());
//       } else {
//         special_characters.push(item);
//       }
//     });

//     const response = {
//       is_success: true,
//       user_id: `${FULL_NAME}_${DOB}`,
//       email: EMAIL,
//       roll_number: ROLL_NUMBER,
//       odd_numbers,
//       even_numbers,
//       alphabets,
//       special_characters,
//       sum: sum.toString(),
//       concat_string: alternatingCapsReverse(alphabets)
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ is_success: false, message: error.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

// index.cjs (replace your file with this)
const express = require("express");
const app = express();

// Raw-body middleware — normalize smart quotes to straight quotes, then parse JSON
app.use((req, res, next) => {
  let raw = "";
  req.setEncoding("utf8");
  req.on("data", chunk => (raw += chunk));
  req.on("end", () => {
    if (!raw) {
      req.body = {};
      return next();
    }

    // Replace curly smart quotes with straight quotes
    const normalized = raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

    try {
      req.body = JSON.parse(normalized);
    } catch (err) {
      // If still invalid JSON, set empty body and keep raw for debugging
      req.body = {};
      req.rawBody = normalized;
    }
    next();
  });
});

// constants
const FULL_NAME = "gautam_singh"; // requirement: lowercase_underscored
const DOB = "15062004";
const EMAIL = "gautamsingh@xyz.com";
const ROLL_NUMBER = "22BSA10140";

function alternatingCapsReverse(arr) {
  const letters = arr.join("").split("").reverse();
  return letters
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

// quick GET so visiting the URL in browser shows something
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", (req, res) => {
  try {
    // Accept data from parsed body or (if parse failed) try to parse req.rawBody
    let data = req.body && req.body.data;
    if (!data && req.rawBody) {
      try {
        const parsed = JSON.parse(req.rawBody);
        data = parsed && parsed.data;
      } catch (e) {
        data = undefined;
      }
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, message: "data must be an array" });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    for (const item of data) {
      const s = String(item);

      if (/^\d+$/.test(s)) {
        const num = parseInt(s, 10);
        (num % 2 === 0 ? even_numbers : odd_numbers).push(String(num)); // numbers returned as strings
        sum += num;
      } else if (/^[a-zA-Z]+$/.test(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }

    const response = {
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string: alternatingCapsReverse(alphabets)
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ is_success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

