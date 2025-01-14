
function Dashboard() {
    return (
        <>
            <div className="grid grid-cols-4 gap-6 mr-4 ">
                {/* Column */}
                <div className="bg-yellow-200 rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold mb-4 text-yellow-800">Backlog</h2>
                    <div className="space-y-2">
                        <div className="p-4 bg-yellow-300 rounded-lg shadow-sm">
                            Database Setup
                        </div>
                        <div className="p-4 bg-yellow-300 rounded-lg shadow-sm">
                            Firebase Integration
                        </div>
                    </div>
                </div>

                <div className="bg-blue-200 rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold mb-4 text-blue-800">To Do</h2>
                    <div className="space-y-2">
                        <div className="p-4 bg-blue-300 rounded-lg shadow-sm">
                            Data Table Page
                        </div>
                        <div className="p-4 bg-blue-300 rounded-lg shadow-sm">
                            Server Side Pagination
                        </div>
                    </div>
                </div>

                <div className="bg-pink-200 rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold mb-4 text-pink-800">Doing</h2>
                    <div className="space-y-2">
                        <div className="p-4 bg-pink-300 rounded-lg shadow-sm">
                            Full Calendar Extension
                        </div>
                        <div className="p-4 bg-pink-300 rounded-lg shadow-sm">
                            Custom Kanban Board
                        </div>
                    </div>
                </div>

                <div className="bg-green-200 rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold mb-4 text-green-800">Completed</h2>
                    <div className="space-y-2">
                        <div className="p-4 bg-green-300 rounded-lg shadow-sm">
                            Vite Server Setup
                        </div>
                        <div className="p-4 bg-green-300 rounded-lg shadow-sm">
                            Make New Login Page
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;