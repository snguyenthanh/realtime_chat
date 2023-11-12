import axios from 'axios';
import { apiUrl } from '@/env';
import { UserCreate } from '@/types';

const httpClient = axios.create({
    withCredentials: true,
    baseURL: apiUrl
 })

const api = {
  async authorizeUser(username: string, password: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);

    return httpClient.post(`${apiUrl}/api/v1/login`, data);
  },
  async unauthorizeUser() {
    return httpClient.post(`${apiUrl}/api/v1/logout`, {withCredentials: true});
  },
  async createUser(userData: UserCreate) {
    return await fetch(
      `${apiUrl}/api/v1/users`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
  },
  async getUsers(query: string) {
    const resp = await httpClient.get(`${apiUrl}/api/v1/users?query=${query}`);
    return resp.data;
  },
  async getConversations() {
    const resp = await httpClient.get(`${apiUrl}/api/v1/conversations`);
    return resp.data;
  },
  async createConversation(userIds: number[]) {
    const resp = await httpClient.post(`${apiUrl}/api/v1/conversations`, { user_ids: userIds });
    return resp.data;
  },
  async getMessagesInConversation(conversationId: string) {
    const resp = await httpClient.get(`${apiUrl}/api/v1/conversations/${conversationId}`);
    return resp.data;
  },
  async getUsersInConversation(conversationId: string) {
    const resp = await httpClient.get(`${apiUrl}/api/v1/conversations/${conversationId}/users`);
    return resp.data;
  },
};

export default api;