import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import ButtonAction from "../atoms/ButtonAction";
import CreateProjectModal from "../organisms/CreateProjectModal";
import EditProjectModal from "../organisms/EditProjectModal";
import ProjectCard from "../molecules/ProjectCard";
import { AgencyActions } from "../../store/actions";
import { agencyApi } from "../../services/api";
import type { Agency } from "../../types";

export default function Dashboard() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome to the GTFS Dashboard! Here you can manage your GTFS data, view analytics, and configure settings.
                </p>
            </div>

            <div className="justify-end flex mb-6">
                <ButtonAction label="new project" onClick={() => setIsModalOpen(true)} />
            </div>

            {agencies.length > 0 ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        projects name ({agencies.length})
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

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {editAgency && (
                <EditProjectModal
                    isOpen={!!editAgency}
                    onClose={() => setEditAgency(null)}
                    agency={editAgency}
                />
            )}
        </div>
    );
}