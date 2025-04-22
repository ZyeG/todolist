const db = require('../../src/persistence');
const deleteItem = require('../../src/routes/deleteItem');
const ITEM = { id: 12345 };

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    getItem: jest.fn(),
}));

test('it removes item correctly', async () => {
    const req = { params: { id: 12345 } };
    // const res = { sendStatus: jest.fn() };

    const res = {
        status: jest.fn().mockReturnThis(),  // allow chaining
        json: jest.fn(),
    };

    await deleteItem(req, res);

    // expect(db.removeItem.mock.calls.length).toBe(1);
    // expect(db.removeItem.mock.calls[0][0]).toBe(req.params.id);
    // expect(res.sendStatus.mock.calls[0].length).toBe(1);
    // expect(res.sendStatus.mock.calls[0][0]).toBe(200);

    expect(db.removeItem).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });

});
