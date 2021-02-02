# Quarantine Walks 
## REST API

### Technology Used

- ExpressJS
- NodeJS
- MongoDB & Mongoose
- bcrypt for hashing passwords
- Multer and Multer S3 for uploading images
- Amazon Web Services S3 (for image storage)
- Heroku (deployment)

## About the backend

This is a pretty straight forward Express API. Two related models were created to represent users and walks. The user must upload an avatar in order to authenticate and once logged in they are authorized to create, edit, and delete walks. Walks are represented by a title, description, image, and a location. 

The most challenging aspect of the backend was integrating an AWS S3 bucket. I discovered that images were not persisting in my heroku app once my app went to sleep. After reading heroku's suggestion of using AWS to solve this issue, I decided to embark. It took a few days of reading docs and looking at examples in order to get the functionality and storage I needed. It was pretty fun, though! 10/10, would do it again.

