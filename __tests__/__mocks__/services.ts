import { mock } from "jest-mock-extended"
import { AuthService } from "../../src/services/authService"
import { UserService } from "../../src/services/userService"
import { TaskService } from "../../src/services/taskService"
import { LabelService } from "../../src/services/labelService"
import { TaskLabelService } from "../../src/services/taskLabelService"


export const AuthServiceMock = mock<AuthService>()
export const UserServiceMock = mock<UserService>()
export const TaskServiceMock = mock<TaskService>()
export const TaskLabelServiceMock = mock<TaskLabelService>()
export const LabelServiceMock = mock<LabelService>()