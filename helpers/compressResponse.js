import zlib from "zlib";

export const conpressResponse = (req, res, next) => {
    const acceptEncoding = req.headers["accept-encoding"] || "";

    if (acceptEncoding.includes("gzip")) {
        const gzip = zlib.createGzip();
        res.setHeader("Content-Encoding", "gzip");
        const originalEnd = res.end;

        res.write = (chunk) => gzip.write(chunk);
        res.end = (chunk) => {
            if (chunk) gzip.end(chunk);
            else gzip.end();
            originalEnd.call(res);
        };

        gzip.pipe(res);
    } else {
        next();
    }
};