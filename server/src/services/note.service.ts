import Note from "@/models/note.model";

export const create = async (note: {
  name: string;
  image: string;
  userId: string;
}) => {
  const newNote = new Note(note);
  await newNote.save();
  return newNote;
};
