import { useState } from "react";
import { gtfsApi } from "../../services/api";
import ButtonAction from "../atoms/ButtonAction";

export default function ExportGTFSContent() {
    const [exporting, setExporting] = useState(false);
    
    const handleExport = async () => {
            setExporting(true);
            try {
                await gtfsApi.exportZip();
            } catch (err) {
                console.error('Export failed:', err);
                alert('Failed to export GTFS. Please try again.');
            } finally {
                setExporting(false);
            }
        };

    return (
        <div className="p-3 border-gray-200">
                <ButtonAction label="export GTFS" onClick={handleExport} disabled={exporting} />
                
                {/* <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {exporting ? 'Exporting...' : 'Export GTFS'}
                </button> */}
            </div>
    )
}