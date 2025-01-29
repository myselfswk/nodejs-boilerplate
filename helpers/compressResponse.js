import zlib from "zlib";

export const conpressResponse = (req, res, next) => {
    const acceptEncoding = req.headers["accept-encoding"] || "";

    if (acceptEncoding.includes("gzip")) {
        const gzip = zlib.createGzip();

        // Set response headers before sending any data
        // res.setHeader("Content-Encoding", "gzip");
        // res.setHeader("Vary", "Accept-Encoding");

        // Create a transform stream for compression
        const compressedStream = new zlib.Gzip();

        // Preserve original methods
        let originalWrite = res.write.bind(res);
        let originalEnd = res.end.bind(res);

        // Replace `write` method
        originalWrite = (chunk, encoding, callback) => {
            compressedStream.write(chunk, encoding, callback);
        };

        // Replace `end` method
        originalEnd = (chunk, encoding, callback) => {
            if (chunk) compressedStream.end(chunk, encoding, callback);
            else compressedStream.end();
        };

        // Pipe the compressed stream to the response
        compressedStream.pipe(res);

        // Handle compression errors
        compressedStream.on("error", (err) => {
            console.error("Gzip Compression Error:", err);
            res.removeHeader("Content-Encoding"); // Remove encoding on failure
            originalWrite(err.message); // Send error message as response
            originalEnd();
        });

        return next();
    }

    next();
}