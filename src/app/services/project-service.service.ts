import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  private apiURL = 'http://localhost:3000/api/projects'
  constructor(
    private http: HttpClient,
  ) { }

  // get project data [get]
  getProjectData(id: any) {
    return this.http.post<any>(this.apiURL + '/getProject', id);
  }

  // get project list [get]
  getProjects() {
    return this.http.get<any>(this.apiURL);
  }

  // Add Project [post]
  addProject(project: any) {
    return this.http.post<any>(this.apiURL + '/', project);
  }

  // update project Name [put]
  updateProject({ id, users, status }: any) {
    return this.http.put<any>(this.apiURL, { id, users, status });
  }

  // update project Name [put]
  updateProjectName({ id, projectname }: any) {
    return this.http.put<any>(this.apiURL + '/updateProjectName', { id, projectname });
  }

  // update project users [put]
  updateProjectUsers({ id, users }: any) {
    return this.http.put<any>(this.apiURL + '/updateProjectName', { id, users });
  }

  // update project Status[put]
  updateProjectStatus({ id, status }: any) {
    return this.http.put<any>(this.apiURL + '/updateProjectName', { id, status });
  }

  // remove project [delete]
  removeProject(project: any) {
    return this.http.post<any>(this.apiURL + '/removeProject', project);
  }

  bulkInsert(projects: any) {
    return this.http.post<any>(this.apiURL + '/importProjects', { projects: projects });
  }

  getExportedProjects() {
    return this.http.get(this.apiURL + '/exportProjects',
      { observe: 'response', responseType: 'blob' });
  }

  removeProjects(projectIds: any) {
    return this.http.post<any>(this.apiURL + '/removeProjects', { projectIds: projectIds });
  }
}
