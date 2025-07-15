'use client';

import { useEffect, useState } from 'react';
import { useResumeStructure } from '@/hooks/useResumeStructure';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ResumeStructureViewer() {
  const {
    latestStructure,
    allStructures,
    currentStructure,
    loading,
    error,
    loadLatestStructure,
    loadAllStructures,
    loadStructureById,
    clearError
  } = useResumeStructure();

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');

  useEffect(() => {
    // Auto-load latest structure when component mounts
    loadLatestStructure();
    loadAllStructures();
  }, [loadLatestStructure, loadAllStructures]);

  const handleLoadSpecific = () => {
    if (selectedEvidenceId.trim()) {
      loadStructureById(selectedEvidenceId.trim());
    }
  };

  if (loading && !latestStructure) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading resume structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resume Structure Viewer</h1>
        <div className="space-x-2">
          <Button onClick={loadLatestStructure} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Latest'}
          </Button>
          <Button variant="outline" onClick={loadAllStructures} disabled={loading}>
            Refresh All
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Load Specific Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Load Specific Resume Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter evidence ID..."
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleLoadSpecific} disabled={loading || !selectedEvidenceId.trim()}>
              Load
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Structures List */}
      {allStructures && allStructures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Resume Structures ({allStructures.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allStructures.map((structure, index) => (
                <div
                  key={structure.evidence_id || index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => structure.evidence_id && loadStructureById(structure.evidence_id)}
                >
                  <div>
                    <p className="font-medium">Evidence ID: {structure.evidence_id}</p>
                    <p className="text-sm text-gray-600">
                      Source: <Badge variant={structure.source === 'hybrid' ? 'default' : 'secondary'}>
                        {structure.source}
                      </Badge>
                    </p>
                    {structure.metadata && (
                      <p className="text-sm text-gray-500 mt-1">
                        {structure.metadata.experience_years} years experience • {' '}
                        {structure.metadata.companies?.length} companies • {' '}
                        {structure.metadata.project_count} projects
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {structure.created_at && new Date(structure.created_at * 1000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Structure Display */}
      {currentStructure && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Resume Structure</span>
              <Badge variant={currentStructure.source === 'hybrid' ? 'default' : 'secondary'}>
                {currentStructure.source}
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Evidence ID: {currentStructure.evidence_id}
              {currentStructure.extracted_at && (
                <span> • Extracted: {new Date(currentStructure.extracted_at).toLocaleDateString()}</span>
              )}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Professional Summary */}
            {currentStructure.structure.professional_summary && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentStructure.structure.professional_summary}
                </p>
              </div>
            )}

            <Separator />

            {/* Work Experience */}
            {currentStructure.structure.work_experiences && currentStructure.structure.work_experiences.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {currentStructure.structure.work_experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h4 className="font-medium text-lg">{exp.job_title}</h4>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {exp.start_date} - {exp.end_date}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {exp.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="text-gray-700">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Skills */}
            {currentStructure.structure.skills && currentStructure.structure.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="space-y-3">
                  {currentStructure.structure.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-800 mb-2">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills?.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Education */}
            {currentStructure.structure.education && currentStructure.structure.education.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="space-y-3">
                  {currentStructure.structure.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">Graduated: {edu.graduation_year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {currentStructure.structure.projects && currentStructure.structure.projects.length > 0 && (
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4">Projects</h3>
                <div className="space-y-4">
                  {currentStructure.structure.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-lg">{project.name}</h4>
                      <p className="text-gray-700 mt-2">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-600 mb-2">Technologies:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.duration && (
                        <p className="text-sm text-gray-500 mt-2">Duration: {project.duration}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {currentStructure.structure.certifications && currentStructure.structure.certifications.length > 0 && (
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="space-y-3">
                  {currentStructure.structure.certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-gray-600">Issued by: {cert.issuer}</p>
                      <p className="text-sm text-gray-500">
                        Issued: {cert.issue_date}
                        {cert.expiry_date && cert.expiry_date !== '' && ` • Expires: ${cert.expiry_date}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {currentStructure.metadata && (
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Experience</p>
                    <p>{currentStructure.metadata.experience_years} years</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Companies</p>
                    <p>{currentStructure.metadata.companies?.length || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Education</p>
                    <p>{currentStructure.metadata.education_count}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Projects</p>
                    <p>{currentStructure.metadata.project_count}</p>
                  </div>
                </div>
                {currentStructure.metadata.companies && currentStructure.metadata.companies.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-600 mb-2">Companies:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentStructure.metadata.companies.map((company, index) => (
                        <Badge key={index} variant="outline">{company}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!currentStructure && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No resume structure loaded. Click "Refresh Latest" to load your most recent resume structure.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}