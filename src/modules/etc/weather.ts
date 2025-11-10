import { Request, Response } from "express";
import { MiddlewareRecord } from "../types";

const mw: MiddlewareRecord = {
  "get /weather": async (req: Request, res: Response) => {
    const city = req.body?.city || "Paris";
    const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_KEY) {
      return res.status(500).json({
        error: "OpenWeather API key not configured (set OPENWEATHER_API_KEY)",
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${OPENWEATHER_KEY}`;

    try {
      const fetchRes = await fetch(url);

      if (!fetchRes.ok) {
        const body = await fetchRes.text();
        return res.status(500).json({
          error: `Failed to fetch weather: ${fetchRes.status} ${fetchRes.statusText} - ${body}`,
        });
      }

      const data = await fetchRes.json();

      const temp = data.main?.temp ?? NaN;
      const temp_min = data.main?.temp_min ?? NaN;
      const temp_max = data.main?.temp_max ?? NaN;
      const weatherMain = data.weather && data.weather[0]?.main;
      const weatherIcon = data.weather && data.weather[0]?.icon;

      return res.json({ temp, temp_min, temp_max, weatherMain, weatherIcon });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error fetching weather: ${error}` });
    }
  },
};

export default mw;
