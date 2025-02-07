import { useUserStore } from "./userStore";
import { create } from 'zustand';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,

    // Funkcija za postavljanje chatId
    setChatId: (chatId) => set({ chatId }),

    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser; // Ensure useUserStore is accessible here

        if (user.blocked?.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }
        else if (currentUser.blocked?.includes(user.id)) {
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        } else {
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            });
        }
    },

    changeBlock: () => {
        set((state) => ({
            ...state,
            isReceiverBlocked: !state.isReceiverBlocked,
        }));
    },
}));
