import numpy as np
import mediapipe as mp
import cv2

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    static_image_mode=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
EAR_THRESHOLD = 0.15

def eye_aspect_ratio(landmarks, eye_indices):
    p = [np.array([landmarks[i].x, landmarks[i].y]) for i in eye_indices]

    # Vertical distances (average both for stability)
    vertical1 = np.linalg.norm(p[1] - p[5])
    vertical2 = np.linalg.norm(p[2] - p[4])
    vertical_avg = (vertical1 + vertical2) / 2.0

    # Horizontal distance (with smoothing)
    horizontal = np.linalg.norm(p[0] - p[3])

    # Avoid division by zero
    if horizontal == 0:
        return 0.0

    ear = vertical_avg / horizontal

    return ear

def are_both_eyes_closed(image: np.ndarray) -> bool:
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)

    if not results.multi_face_landmarks:
        return False 

    landmarks = results.multi_face_landmarks[0].landmark

    left_ear = eye_aspect_ratio(landmarks, LEFT_EYE)
    right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE)

    return left_ear < EAR_THRESHOLD and right_ear < EAR_THRESHOLD