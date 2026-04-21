import { useCallback, useEffect, useState } from 'react';

export namespace UngDungBlogCaNhan {
	export interface Author {
		name: string;
		bio: string;
		skills: string[];
		socialLinks: { platform: string; url: string }[];
		avatar: string;
	}

	export interface Tag {
		id: string;
		name: string;
		postCount: number;
	}

	export interface Post {
		id: string;
		title: string;
		slug: string;
		content: string;
		thumbnail: string;
		tags: string[];
		status: 'draft' | 'published';
		views: number;
		createdAt: string;
		updatedAt: string;
		author: string;
	}
}

const STORAGE_KEYS = {
	POSTS: 'blog_posts',
	TAGS: 'blog_tags',
	AUTHOR: 'blog_author',
} as const;

const generateId = (): string => {
	return Date.now().toString();
};

const updateTagPostCounts = (
	posts: UngDungBlogCaNhan.Post[],
	tags: UngDungBlogCaNhan.Tag[],
): UngDungBlogCaNhan.Tag[] => {
	return tags.map((tag) => ({
		...tag,
		postCount: posts.filter((post) => post.tags.includes(tag.id)).length,
	}));
};

const useUngDungBlogCaNhan = () => {
	const [posts, setPosts] = useState<UngDungBlogCaNhan.Post[]>([]);
	const [tags, setTags] = useState<UngDungBlogCaNhan.Tag[]>([]);
	const [author, setAuthor] = useState<UngDungBlogCaNhan.Author | null>(null);

	useEffect(() => {
		const postsData = localStorage.getItem(STORAGE_KEYS.POSTS);
		const tagsData = localStorage.getItem(STORAGE_KEYS.TAGS);
		const authorData = localStorage.getItem(STORAGE_KEYS.AUTHOR);

		if (postsData) {
			setPosts(JSON.parse(postsData));
		}
		if (tagsData) {
			setTags(JSON.parse(tagsData));
		}
		if (authorData) {
			setAuthor(JSON.parse(authorData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
	}, [posts]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
	}, [tags]);

	useEffect(() => {
		if (author) {
			localStorage.setItem(STORAGE_KEYS.AUTHOR, JSON.stringify(author));
		}
	}, [author]);

	const capNhatAuthor = useCallback((data: UngDungBlogCaNhan.Author): boolean => {
		try {
			setAuthor(data);
			return true;
		} catch (error) {
			console.error('Error updating author:', error);
			return false;
		}
	}, []);

	const themTag = useCallback((data: Omit<UngDungBlogCaNhan.Tag, 'id' | 'postCount'>): boolean => {
		try {
			const newTag: UngDungBlogCaNhan.Tag = {
				...data,
				id: generateId(),
				postCount: 0,
			};
			setTags((prev) => [...prev, newTag]);
			return true;
		} catch (error) {
			console.error('Error adding tag:', error);
			return false;
		}
	}, []);

	const capNhatTag = useCallback(
		(id: string, data: Partial<Omit<UngDungBlogCaNhan.Tag, 'id' | 'postCount'>>): boolean => {
			try {
				setTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, ...data } : tag)));
				return true;
			} catch (error) {
				console.error('Error updating tag:', error);
				return false;
			}
		},
		[],
	);

	const xoaTag = useCallback((id: string): boolean => {
		try {
			setTags((prev) => prev.filter((tag) => tag.id !== id));
			// Remove tag from posts
			setPosts((prev) =>
				prev.map((post) => ({
					...post,
					tags: post.tags.filter((tagId) => tagId !== id),
				})),
			);
			return true;
		} catch (error) {
			console.error('Error deleting tag:', error);
			return false;
		}
	}, []);

	const getTagById = useCallback(
		(id: string) => {
			return tags.find((tag) => tag.id === id);
		},
		[tags],
	);

	const themPost = useCallback(
		(data: Omit<UngDungBlogCaNhan.Post, 'id' | 'views' | 'createdAt' | 'updatedAt'>): boolean => {
			try {
				const now = new Date().toISOString();
				const newPost: UngDungBlogCaNhan.Post = {
					...data,
					id: generateId(),
					views: 0,
					createdAt: now,
					updatedAt: now,
				};
				setPosts((prev) => [...prev, newPost]);
				return true;
			} catch (error) {
				console.error('Error adding post:', error);
				return false;
			}
		},
		[],
	);

	const capNhatPost = useCallback(
		(id: string, data: Partial<Omit<UngDungBlogCaNhan.Post, 'id' | 'views' | 'createdAt'>>): boolean => {
			try {
				const now = new Date().toISOString();
				setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...data, updatedAt: now } : post)));
				return true;
			} catch (error) {
				console.error('Error updating post:', error);
				return false;
			}
		},
		[],
	);

	const xoaPost = useCallback((id: string): boolean => {
		try {
			setPosts((prev) => prev.filter((post) => post.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting post:', error);
			return false;
		}
	}, []);

	const getPostById = useCallback(
		(id: string) => {
			return posts.find((post) => post.id === id);
		},
		[posts],
	);

	const getPublishedPosts = useCallback(() => {
		return posts.filter((post) => post.status === 'published');
	}, [posts]);

	const getPostsByTag = useCallback(
		(tagId: string) => {
			return posts.filter((post) => post.tags.includes(tagId));
		},
		[posts],
	);

	const searchPosts = useCallback(
		(query: string) => {
			const lowerQuery = query.toLowerCase();
			return posts.filter(
				(post) => post.title.toLowerCase().includes(lowerQuery) || post.content.toLowerCase().includes(lowerQuery),
			);
		},
		[posts],
	);

	const incrementPostViews = useCallback((id: string) => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === id ? { ...post, views: post.views + 1, updatedAt: new Date().toISOString() } : post,
			),
		);
	}, []);

	const getRelatedPosts = useCallback(
		(postId: string, limit: number = 5) => {
			const post = posts.find((p) => p.id === postId);
			if (!post) return [];
			return posts.filter((p) => p.id !== postId && p.tags.some((tagId) => post.tags.includes(tagId))).slice(0, limit);
		},
		[posts],
	);

	return {
		posts,
		tags,
		author,

		capNhatAuthor,

		themTag,
		capNhatTag,
		xoaTag,
		getTagById,

		themPost,
		capNhatPost,
		xoaPost,
		getPostById,
		getPublishedPosts,
		getPostsByTag,
		searchPosts,
		incrementPostViews,
		getRelatedPosts,
	};
};

export type Post = UngDungBlogCaNhan.Post;
export type Tag = UngDungBlogCaNhan.Tag;
export type Author = UngDungBlogCaNhan.Author;

export { generateId, updateTagPostCounts };

export const loadPosts = (): Post[] => {
	const data = localStorage.getItem(STORAGE_KEYS.POSTS);
	return data ? JSON.parse(data) : [];
};

export const savePosts = (posts: Post[]): void => {
	localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};

export const loadTags = (): Tag[] => {
	const data = localStorage.getItem(STORAGE_KEYS.TAGS);
	return data ? JSON.parse(data) : [];
};

export const saveTags = (tags: Tag[]): void => {
	localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export const loadAuthor = (): Author | null => {
	const data = localStorage.getItem(STORAGE_KEYS.AUTHOR);
	return data ? JSON.parse(data) : null;
};

export const saveAuthor = (author: Author): void => {
	localStorage.setItem(STORAGE_KEYS.AUTHOR, JSON.stringify(author));
};

export default useUngDungBlogCaNhan;
