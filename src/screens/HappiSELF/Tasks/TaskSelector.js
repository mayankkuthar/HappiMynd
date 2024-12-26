import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Components
import AudioTask from "./AudioTask";
import MCQTask from "./MCQTask";
import CheckBoxTask from "./CheckBoxTask";
import VideoTask from "./VideoTask";
import TextTask from "./TextTask";
import MatchFollowingTask from "./MatchFollowingTask";
import LinearScaleTask from "./LinearScaleTask";
import ShortAnswerTask from "./ShortAnswerTask";

const TaskSelector = (props) => {
  // Prop Destructuring
  const { question } = props;

  if (question.content_type == "audio") return <AudioTask {...props} />;
  else if (question.content_type == "question_mcq")
    return <MCQTask {...props} />;
  else if (question.content_type == "question_checkbox")
    return <CheckBoxTask {...props} />;
  else if (question.content_type == "video") return <VideoTask {...props} />;
  else if (question.content_type == "text") return <TextTask {...props} />;
  else if (question.content_type == "question_match")
    return <MatchFollowingTask {...props} />;
  else if (question.content_type == "linear_scale")
    return <LinearScaleTask {...props} />;
  else if (question.content_type == "short_answer")
    return <ShortAnswerTask {...props} />;
  else return null;
};

const styles = StyleSheet.create({});

export default TaskSelector;
