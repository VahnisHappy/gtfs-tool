import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import ButtonAction from "../atoms/ButtonAction";
import ProjectModal from "../organisms/ProjectModal";
import ProjectCard from "../molecules/ProjectCard";
import { AgencyActions } from "../../store/actions";
import { agencyApi } from "../../services/api";
import type { Agency } from "../../types";

export default function Dashboard() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editAgency, setEditAgency] = useState<Agency | null>(null);
    const agencies = useSelector((state: RootState) => state.agencyState.data);

    useEffect(() => {
        const loadAgencies = async () => {
            try {
                const data = await agencyApi.getAll();
                const agencies: Agency[] = data.map((a) => ({
                    id: { value: a.agency_id },
                    name: { value: a.agency_name },
                    url: { value: a.agency_url },
                    timezone: { value: a.agency_timezone },
                    ...(a.agency_lang && { lang: { value: a.agency_lang } }),
                    ...(a.agency_phone && { phone: { value: a.agency_phone } }),
                    ...(a.agency_fare_url && { fareUrl: { value: a.agency_fare_url } }),
                    ...(a.agency_email && { email: { value: a.agency_email } }),
                }));
                dispatch(AgencyActions.setAgencies(agencies));
            } catch (error) {
                console.error('Failed to load agencies:', error);
            }
        };
        loadAgencies();
    }, []);

    return (
        <div className="p-8">
            <div className="justify-end flex mb-6 items-center">
                <p className="text-sm text-gray-500 mr-4 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#9e9e9e" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                    user guide
                </p>
                <ButtonAction label="new project" onClick={() => setIsCreateOpen(true)} />
            </div>

            {agencies.length > 0 ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        agencies ({agencies.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                        {agencies.map((agency) => (
                            <ProjectCard
                                key={agency.id.value}
                                agency={agency}
                                onEdit={() => setEditAgency(agency)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-center mb-8">
                        <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-6">get started by creating your first GTFS project</p>
                    </div>
                </div>
            )}

            {/* Create mode — no agency prop */}
            <ProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

            {/* Edit mode — pass the agency */}
            {editAgency && (
                <ProjectModal
                    isOpen={!!editAgency}
                    onClose={() => setEditAgency(null)}
                    agency={editAgency}
                />
            )}
        </div>
    );
}