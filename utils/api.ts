const createURL = (path: string) => {
  return window.location.origin + path;
};

// Update Entry (PATCH)
export const updateEntry = async (id: Number, content: string, title: string) => {
  try {
    const res = await fetch(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json' // Essential for JSON payloads
      },
      body: JSON.stringify({ content, title }) // Combined content and title
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    } else {
      // Improved error handling:
      const errorData = await res.json(); 
      throw new Error(errorData?.message || 'Failed to update entry');
    }
  } catch (error) {
    console.error('Error updating entry:', error); // Log for debugging
    throw error; // Re-throw the error for higher-level handling
  }
};

export const deleteEntry = async (id: Number) => {
  try {
    const res = await fetch(createURL(`/api/journal/${id}`), {
      method: 'DELETE',
    });

    if (res.ok) {
      return true;
    } else {
      const errorData = await res.json();
      throw new Error(errorData?.message || 'Failed to delete entry');
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }

}

// Create New Entry (POST)
export const createNewEntry = async () => {
  try {
    const res = await fetch(createURL('/api/journal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    } else {
      const errorData = await res.json();
      throw new Error(errorData?.message || 'Failed to create new entry');
    }
  } catch (error) {
    console.error('Error creating new entry:', error);
    throw error; 
  }
};
  
  export const askQuestion = async (question: string) => {
    const res = await fetch(
      new Request(createURL('/api/question'), {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
    );
  
    if (res.ok) {
      const data = await res.json();
      return data.data;
    } else {
      throw new Error('Failed to ask question');
    }
  };
  