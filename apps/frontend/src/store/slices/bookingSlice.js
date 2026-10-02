import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    date: new Date().toISOString().split("T")[0],
    slot: null,
    tickets: {},
    addons: {},
    visitorInfo: {
        name: "",
        email: "",
        phone: "",
    },
    totalAmount: 0,
    ticketTotal: 0,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,

    reducers: {
        setDate: (state, action) => {
            state.date = action.payload;
        },

        setSlot: (state, action) => {
            state.slot = action.payload;
        },

        setTickets: (state, action) => {
            state.tickets = action.payload;
        },

        setAddons: (state, action) => {
            state.addons = action.payload;
        },

        setVisitorInfo: (state, action) => {
            state.visitorInfo = action.payload;
        },

        setTotalAmount: (state, action) => {
            state.totalAmount = action.payload;
        },
        setTicketTotal: (state, action) => {
            state.ticketTotal = action.payload;
        },

        resetBooking: () => initialState,
    },
});

export const {
    setDate,
    setSlot,
    setTickets,
    setAddons,
    setVisitorInfo,
    setTotalAmount,
    resetBooking,
    setTicketTotal,
} = bookingSlice.actions;

export default bookingSlice.reducer;