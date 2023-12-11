import React, { useState } from "react";
import axios from "axios";
import { makeUrlId } from "./utils/makeUrl";

const UserTags = ({ userTags, onEditTag, onDeleteTag }) => {
  const [editedTagName, setEditedTagName] = useState("");

  const handleEditInput = (e) => {

    setEditedTagName(e.target.value);
  };

  // const handleEditInput = (event, field) => {
  //   setEditedTagName({ ...userTags, [field]: event.target.value });
  // };

  const handleEditSubmit = async (tagId) => {

    try {
      // if (isTagUsedByOthers(tagId)) {
      //   alert("This tag is used by other users and cannot be edited.");
      //   return;
      // }
      await axios.put(makeUrlId('tags', tagId), { name: editedTagName }, { withCredentials: true });
      console.log(`Successfully edited tag with ID ${tagId}`);
      console.log("changed name = " + editedTagName);
      const updatedUserTags = userTags.map((tag) => (tag._id === tagId ? { ...tag, name: editedTagName } : tag));
      console.log(updatedUserTags);
      onEditTag(updatedUserTags); // Update state with edited tags
      setEditedTagName(""); // Clear edit input after successful update
    } catch (error) {
      console.error("Error editing tag:", error);
    }
  };

  const handleDelete = async (tagId) => {
    try {
      await axios.delete(makeUrlId('tags', tagId), { withCredentials: true });
      const updatedUserTags = userTags.filter((tag) => tag.id !== tagId);
      onDeleteTag(updatedUserTags);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };
  
  // const isTagUsedByOthers = async (tagId) => {
  //   try {
  //     const response = await axios.get(makeUrlId('tags/getQuestionsForTag', tagId));
  //     const tag = response.data;
  
  //     console.log("Tag length = ", tag.length);
  //     return tag.length > 1;
  //   } catch (error) {
  //     console.error("Error checking tag usage:", error);
  //   }
  //   return false;
  // };


  return (
    <div>
      <h2>Your Tags ({userTags.length})</h2>
      <ul>
        {userTags.map((tag) => (
          <li key={tag._id}>
            <input
              id="tagTextInput"
              type="text"
              value={editedTagName || tag.name}
              onChange={(e) => handleEditInput(e)}
            />
            <button id="editTagButton" className="edit-tag-button" onClick={() => handleEditSubmit(tag._id)} disabled={!editedTagName || editedTagName === tag.name}>
              Re-post
            </button>
            <button id="deleteTagButton" className="delete-tag-button" onClick={() => handleDelete(tag._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { UserTags };
