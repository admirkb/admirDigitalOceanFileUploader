import { Component } from '@angular/core';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

// Initialize the S3 client with your DigitalOcean Spaces configuration
const s3Client = new S3Client({
  endpoint: environment.s3Endpoint, // Ensure this endpoint is correct
  region: environment.s3Region, // Ensure this region is correct
  forcePathStyle: false,
  credentials: {
    accessKeyId: environment.s3AccessKeyId,
    secretAccessKey: environment.s3SecretAccessKey
  }
});

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  selectedFiles: File[] = [];
  uploadedFiles: { name: string }[] = [];


  // Handles file selection
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);

  }

  async uploadFiles() {

    // const s3Client = new S3Client(
    //   {
    //     endpoint: "https://lon1.digitaloceanspaces.com",
    //     forcePathStyle: false,
    //     region: environment.s3Region,
    //     credentials: {
    //       accessKeyId: environment.s3AccessKeyId, // Your DigitalOcean Access Key
    //       secretAccessKey: environment.s3SecretAccessKey, // Your DigitalOcean Secret Key
    //     },
    //   }
    // );


    // const params: PutObjectCommandInput = {
    //   Bucket: "admirtv", // The path to the directory you want to upload the object to, starting with your Space name.
    //   Key: "000001/000001-0000001/admir__TV_digital_signage/c28dfa34-e680-484d-8283-4fe4c2b29181/xxx.txt", // Object key, referenced whenever you want to access this file later.
    //   Body: "Hello, World!", // The object's contents. This variable is an object, not a string.
    //   ACL: "private", // Defines ACL permissions, such as private or public.
    //   Metadata: { // Defines metadata tags.
    //     "x-amz-meta-my-key": "your-value"
    //   }
    // };

    console.log("s3Client", s3Client)


    const SPACE_NAME = environment.s3BucketName;
    for (let file of this.selectedFiles) {
      const params: PutObjectCommandInput = {
        Bucket: SPACE_NAME,
        Key: file.name, // Use the file name as the object key
        Body: file, // The file itself
        ACL: 'private', // Or 'public-read', depending on your needs
        Metadata: {
          'x-amz-meta-my-key': 'your-value' // Example metadata
        }
      };

      console.log("params", params)
      try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        console.log('Successfully uploaded object:', file.name);
        this.uploadedFiles.push({ name: file.name });
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
      }
    }


    // const uploadObject = async () => {
    //   try {
    //     const data = await s3Client.send(new PutObjectCommand(params));
    //     console.log(
    //       "Successfully uploaded object: " +
    //         params.Bucket +
    //         "/" +
    //         params.Key
    //     );
    //     return data;
    //   } catch (err) {
    //     console.log("Error", err);
    //   }
    // };


    // uploadObject();


  }


  // Uploads the selected files to DigitalOcean Space
  // async uploadFiles() {
  //   const SPACE_NAME = environment.s3BucketName;

  //   for (let file of this.selectedFiles) {
  //     const params: PutObjectCommandInput = {
  //       Bucket: SPACE_NAME,
  //       Key: file.name, // Use the file name as the object key
  //       Body: file, // The file itself
  //       ACL: 'private', // Or 'public-read', depending on your needs
  //       Metadata: {
  //         'x-amz-meta-my-key': 'your-value' // Example metadata
  //       }
  //     };

  //     console.log("params", params)
  //     try {
  //       const command = new PutObjectCommand(params);
  //       const data = await s3Client.send(command);
  //       console.log('Successfully uploaded object:', file.name);
  //       this.uploadedFiles.push({ name: file.name });
  //     } catch (err) {
  //       console.error('Error uploading file:', file.name, err);
  //     }
  //   }
  // }

  // Optionally, add a method to remove files if needed
  async removeFile(fileName: string) {
    // Implement delete functionality if required
  }
}
