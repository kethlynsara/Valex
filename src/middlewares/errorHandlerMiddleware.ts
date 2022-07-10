import {Request, Response, NextFunction} from "express";

export default function errorHandler (error, req: Request, res: Response, next: NextFunction) {
    console.log(error);

    if (error.type === "not found") {
        return res.status(404).send(error.message);
    }

    if (error.type === "unauthorized") {
        return res.status(401).send(error.message);
    }

    res.sendStatus(500);
}