import * as Mongoose from 'mongoose';

import { IUser } from './users';

export interface IImage {
	file: String,
	statut: String,
	name: String,
	author: IUser,
	creationDate: Date
}

export interface IImageModel extends IImage, Mongoose.Document {
	toPublicObject(): IImage;
}

var imageSchema: Mongoose.Schema = new Mongoose.Schema({
	file: String,
	name: String,
	author: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
	creationDate: {
		type: Date,
		default: Date.now
	}
});

imageSchema.methods.toPublicObject = function(): IImage {
	return {
		file: this.file,
		statut: this.statut,
		name: this.name,
		author: this.author,
		creationDate: this.creationDate
	};
};

export const Images: Mongoose.Model<IImageModel> = Mongoose.model<IImageModel>('User', imageSchema);