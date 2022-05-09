import { config } from "../config/Constants"
import { Request, Response } from "express"
import shortId from 'shortid'
import { URLModel } from "database/model/URL"


export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        // URL exists?
        const { originURL } = req.body
        const url = URLModel.findOne({ originURL })
        if (url) {
            response.json(url)
            return
        }
        // Create hash for URL
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        // Save URL on database
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        // Return URL saved
        response.json(newURL)
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        // Get URL hash
        const { hash } = req.params
        const url = URLModel.findOne({ hash })
        // Find original URL back on hash
        if (url) {
            response.redirect(url.originURL)
            return
        }
        // Redirect to original URL
        response.status(400).json({error: "URL not found."})
    }
} 