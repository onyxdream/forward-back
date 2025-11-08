import { Request, Response } from "express";
import { MiddlewareRecord } from "../types";
import speedTest from "speedtest-net";
import os from "os";

const mw: MiddlewareRecord = {
  "get /network/stats": async (req: Request, res: Response) => {
    try {
      const result = await speedTest({ acceptLicense: true, acceptGdpr: true });

      res.json({
        download: result.download.bandwidth,
        upload: result.upload.bandwidth,
      });
    } catch (error) {
      console.error("Speedtest error:", error);
      return res.status(500).json({ error: "Failed to perform speed test" });
    }
  },
  "get /network/interfaces": async (req: Request, res: Response) => {
    try {
      const networkInterfaces = os.networkInterfaces();
      res.json(networkInterfaces);
    } catch (error) {
      res.status(500).json({ error: "Failed to get network interfaces" });
    }
  },
};

/**
 *     try {
      // make request
      const result = await new Promise((resolve, reject) => {
        exec("speedtest --json", (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            const result = JSON.parse(stdout);

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      });

      return res.json(result);
    } catch (error) {
      console.error("Speedtest error:", error);
      return res.status(500).json({ error: "Failed to perform speed test" });
    }
 */

/**
 *     const testuUploadUrl = "http://127.0.0.1";
    const uploadDataSizeBytes = 10 * 1024 * 1024; // example: 10MB upload
    const testDownloadUrl = "http://ipv4.download.thinkbroadband.com/10MB.zip";

    // Run both tests in parallel
    Promise.all([
      measureDownloadSpeed(testDownloadUrl),
      measureUploadSpeed(testuUploadUrl, uploadDataSizeBytes),
    ])
      .then(([downloadResult, uploadResult]) => {
        // Combine results
        const combinedResult = {
          download: downloadResult,
          upload: uploadResult,
        };

        try {
          res.json(combinedResult);
          console.log(
            `Download Speed: ${downloadResult.speedMbps.toFixed(2)} Mbps`
          );
          console.log(
            `Upload Speed: ${uploadResult.speedMbps.toFixed(2)} Mbps`
          );
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      })
      .catch((err) => {
        console.error("Speed test error:", err);
        res.status(500).json({ error: "Error performing speed tests" });
      });
 */

export default mw;
