import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import useAuthStore from '../../store/authStore';
import useShowToast from '../../hooks/useShowToast';
import { Button, Input, Textarea, VStack } from '@/components/ui/';

const AddNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!authUser) {
      showToast('Error', 'You must be logged in to add a note', 'error');
      return;
    }
    if (!title.trim() || !content.trim()) {
      showToast('Error', 'Title and content are required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const newNote = {
        title: title.trim(),
        content: content.trim(),
        createdAt: Date.now(),
        createdBy: authUser.uid,
      };

      await addDoc(collection(firestore, 'notes'), newNote);
      showToast('Success', 'Note added successfully', 'success');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
      showToast('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddNote}>
      <VStack spacing={4}>
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" isLoading={isLoading}>
          Add Note
        </Button>
      </VStack>
    </form>
  );
};

export default AddNote;