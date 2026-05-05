import { useCallback, useEffect, useState } from 'react';

export namespace ToDoList {
	export interface Task {
		id: string;
		title: string;
		description: string;
		deadline: string;
		priority: 'Cao' | 'Trung bình' | 'Thấp';
		tags: string[];
		status: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
		createdAt: string;
		updatedAt: string;
	}

	export interface Tag {
		id: string;
		name: string;
		taskCount: number;
	}
}

const STORAGE_KEYS = {
	TASKS: 'todo_tasks',
	TAGS: 'todo_tags',
} as const;

const generateId = (): string => {
	return Date.now().toString();
};

const updateTagTaskCounts = (tasks: ToDoList.Task[], tags: ToDoList.Tag[]): ToDoList.Tag[] => {
	return tags.map((tag) => ({
		...tag,
		taskCount: tasks.filter((task) => task.tags.includes(tag.id)).length,
	}));
};

const useToDoList = () => {
	const [tasks, setTasks] = useState<ToDoList.Task[]>([]);
	const [tags, setTags] = useState<ToDoList.Tag[]>([]);

	useEffect(() => {
		const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
		const tagsData = localStorage.getItem(STORAGE_KEYS.TAGS);

		if (tasksData) {
			const parsedTasks = JSON.parse(tasksData);
			const fixedTasks = parsedTasks.map((task: any) => ({
				...task,
				tags: task.tags || [],
			}));
			setTasks(fixedTasks);
		}
		if (tagsData) {
			setTags(JSON.parse(tagsData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
	}, [tasks]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
	}, [tags]);

	const themTag = useCallback((data: Omit<ToDoList.Tag, 'id' | 'taskCount'>): boolean => {
		try {
			const newTag: ToDoList.Tag = {
				...data,
				id: generateId(),
				taskCount: 0,
			};
			setTags((prev) => [...prev, newTag]);
			return true;
		} catch (error) {
			console.error('Lỗi khi thêm tag:', error);
			return false;
		}
	}, []);

	const capNhatTag = useCallback((id: string, data: Partial<Omit<ToDoList.Tag, 'id' | 'taskCount'>>): boolean => {
		try {
			setTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, ...data } : tag)));
			return true;
		} catch (error) {
			console.error('Lỗi khi cập nhật tag:', error);
			return false;
		}
	}, []);

	const xoaTag = useCallback((id: string): boolean => {
		try {
			setTags((prev) => prev.filter((tag) => tag.id !== id));
			setTasks((prev) =>
				prev.map((task) => ({
					...task,
					tags: task.tags.filter((tagId) => tagId !== id),
				})),
			);
			return true;
		} catch (error) {
			console.error('Lỗi khi xóa tag:', error);
			return false;
		}
	}, []);

	const getTagById = useCallback(
		(id: string) => {
			return tags.find((tag) => tag.id === id);
		},
		[tags],
	);

	const themTask = useCallback((data: Omit<ToDoList.Task, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
		try {
			const now = new Date().toISOString();
			const newTask: ToDoList.Task = {
				...data,
				tags: data.tags || [],
				id: generateId(),
				createdAt: now,
				updatedAt: now,
			};
			setTasks((prev) => {
				const newTasks = [...prev, newTask];
				setTags((prevTags) => updateTagTaskCounts(newTasks, prevTags));
				return newTasks;
			});
			return true;
		} catch (error) {
			console.error('Lỗi khi thêm task:', error);
			return false;
		}
	}, []);

	const capNhatTask = useCallback((id: string, data: Partial<Omit<ToDoList.Task, 'id' | 'createdAt'>>): boolean => {
		try {
			const now = new Date().toISOString();
			setTasks((prev) => {
				const newTasks = prev.map((task) =>
					task.id === id
						? { ...task, ...data, tags: data.tags !== undefined ? data.tags : task.tags, updatedAt: now }
						: task,
				);
				if (data.tags !== undefined) {
					setTags((prevTags) => updateTagTaskCounts(newTasks, prevTags));
				}
				return newTasks;
			});
			return true;
		} catch (error) {
			console.error('Lỗi khi cập nhật task:', error);
			return false;
		}
	}, []);

	const xoaTask = useCallback((id: string): boolean => {
		try {
			setTasks((prev) => {
				const newTasks = prev.filter((task) => task.id !== id);
				setTags((prevTags) => updateTagTaskCounts(newTasks, prevTags));
				return newTasks;
			});
			return true;
		} catch (error) {
			console.error('Lỗi khi xóa task:', error);
			return false;
		}
	}, []);

	const getTaskById = useCallback(
		(id: string) => {
			return tasks.find((task) => task.id === id);
		},
		[tasks],
	);

	const getTasksByStatus = useCallback(
		(status: ToDoList.Task['status']) => {
			return tasks.filter((task) => task.status === status);
		},
		[tasks],
	);

	const getTasksByTag = useCallback(
		(tagId: string) => {
			return tasks.filter((task) => task.tags.includes(tagId));
		},
		[tasks],
	);

	const searchTasks = useCallback(
		(query: string) => {
			const lowerQuery = query.toLowerCase();
			return tasks.filter(
				(task) => task.title.toLowerCase().includes(lowerQuery) || task.description.toLowerCase().includes(lowerQuery),
			);
		},
		[tasks],
	);

	const getOverdueTasks = useCallback(() => {
		const now = new Date();
		return tasks.filter((task) => task.status !== 'Hoàn thành' && new Date(task.deadline) < now);
	}, [tasks]);

	const getCompletedTasks = useCallback(() => {
		return tasks.filter((task) => task.status === 'Hoàn thành');
	}, [tasks]);

	const getTotalTasks = useCallback(() => tasks.length, [tasks]);

	return {
		tasks,
		tags,

		themTag,
		capNhatTag,
		xoaTag,
		getTagById,

		themTask,
		capNhatTask,
		xoaTask,
		getTaskById,
		getTasksByStatus,
		getTasksByTag,
		searchTasks,
		getOverdueTasks,
		getCompletedTasks,
		getTotalTasks,
	};
};

export type Task = ToDoList.Task;
export type Tag = ToDoList.Tag;

export { generateId, updateTagTaskCounts };

export const loadTasks = (): Task[] => {
	const data = localStorage.getItem(STORAGE_KEYS.TASKS);
	return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]): void => {
	localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const loadTags = (): Tag[] => {
	const data = localStorage.getItem(STORAGE_KEYS.TAGS);
	return data ? JSON.parse(data) : [];
};

export const saveTags = (tags: Tag[]): void => {
	localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export default useToDoList;
