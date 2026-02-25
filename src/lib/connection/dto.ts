"use client";

export const dto = {
  getCommentResponse: (data: any): any => {
    const {
      uuid,
      own,
      name,
      presence,
      comment,
      created_at,
      is_admin,
      is_parent,
      gif_url,
      ip,
      user_agent,
      comments,
      like_count,
    } = data;
    return {
      uuid,
      own,
      name,
      presence,
      comment,
      created_at,
      is_admin: is_admin ?? false,
      is_parent,
      gif_url,
      ip,
      user_agent,
      comments: comments?.map(dto.getCommentResponse) ?? [],
      like_count: like_count ?? 0,
    };
  },

  getCommentsResponse: (data: any[]): any[] => data.map(dto.getCommentResponse),

  getCommentsResponseV2: (data: any) => ({
    count: data.count,
    lists: dto.getCommentsResponse(data.lists),
  }),

  statusResponse: ({ status }: { status: boolean }) => ({ status }),

  tokenResponse: ({ token }: { token: string }) => ({ token }),

  uuidResponse: ({ uuid }: { uuid: string }) => ({ uuid }),

  commentShowMore: (uuid: string, show: boolean = false) => ({ uuid, show }),

  postCommentRequest: (
    id: string | null,
    name: string,
    presence: boolean,
    comment: string | null,
    gif_id: string | null,
  ) => ({
    id,
    name,
    presence,
    comment,
    gif_id,
  }),

  postSessionRequest: (email: string, password: string) => ({
    email,
    password,
  }),

  updateCommentRequest: (
    presence: boolean | null,
    comment: string | null,
    gif_id: string | null,
  ) => ({
    presence,
    comment,
    gif_id,
  }),
};
