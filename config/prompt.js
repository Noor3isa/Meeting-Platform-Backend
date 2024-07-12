let systemPrompt = "the input image that is a snapshot out of an online meeting, your task is to deduce whether the person in it is engaged in this meeting or distracted, and whether their eye gaze and head pose are towards the screen or straying away from it. the output should be a json with the following keys: {'is_engaged':  boolean, 'body_language': boolean }, the 'is_engaged' has to be a boolean, and 'body_language' should also be a boolean with true meaning looking at screen, and false meaning looking away. make sure when returning 'true' and 'false' should be lowercase";

module.exports = systemPrompt;