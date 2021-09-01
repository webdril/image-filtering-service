import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send(`image_url is needed to proceed`);
    }

    try {
      const filteredpath = await filterImageFromURL(image_url)

      await res.status(200).sendFile(filteredpath, {}, (err) => {
        if (err) { return res.status(422).send(`image cannot be processed`); }
       
        deleteLocalFiles([filteredpath])
      })
    } catch (err) {
      res.status(422).send(`image cannot be processed, please ensure image url is correct`)
    }
  });

 
  app.get( "/", async ( req, res ) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
})();