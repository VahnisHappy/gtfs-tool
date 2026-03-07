import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { Agency } from '../../types';
import { AppActions, AgencyActions } from '../../store/actions';
import { agencyApi } from '../../services/api';

export type ProjectCardProps = {
  agency: Agency;
  onEdit?: () => void;
};

export default function ProjectCard({ agency, onEdit }: ProjectCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleOpenProject = () => {
    dispatch(AgencyActions.setActiveAgency(agency.id.value));
    dispatch(AppActions.setContent('stops'));
    navigate('/app');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDeleteProject = async () => {
    if (window.confirm(`Are you sure you want to delete "${agency.name.value}"?`)) {
      try {
        await agencyApi.delete(agency.id.value);
        dispatch(AgencyActions.removeAgency(agency.id.value));
      } catch (error) {
        console.error('Failed to delete agency:', error);
      }
    }
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <>
      <div
        className="bg-white hover:bg-gray-50 rounded-md duration-200 p-3 cursor-pointer border border-gray-200 flex flex-col h-full min-h-[200px]"
        onClick={handleOpenProject}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="text-xl font-medium text-gray-800 mb-1 truncate">
              {agency.name.value}
            </h3>
          </div>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a href={agency.url.value} target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-600 truncate"
              onClick={(e) => e.stopPropagation()}>
              {agency.url.value}
            </a>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {agency.timezone.value}
          </div>

          {agency.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {agency.phone.value}
            </div>
          )}

          {agency.email && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {agency.email.value}
            </div>
          )}
        </div>

        {/* Action buttons: Edit, Delete, Open */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            className="hover:text-blue-800 text-sm font-medium flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            edit
          </button>
          <button
            className="hover:text-red-800 text-sm font-medium text-red-600 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProject();
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            delete
          </button>
          {/* <button
            className="hover:text-blue-800 text-sm font-medium flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenProject();
            }}
          >
            open
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button> */}
        </div>
      </div>

      {/* Context Menu */}
      {/* {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => { onEdit?.(); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Project
          </button>
          <button
            onClick={handleDeleteProject}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Project
          </button>
        </div>
      )} */}
    </>
  );
}
