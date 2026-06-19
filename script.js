const navItems = document.querySelectorAll("nav li");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

function openPage(pageId) {
  pages.forEach((page) => {
    page.classList.remove("active-page");
  });

  document.getElementById(pageId).classList.add("active-page");

  navItems.forEach((nav) => {
    nav.classList.remove("active");

    if (nav.dataset.page === pageId) {
      nav.classList.add("active");
    }
  });

  pageTitle.textContent = pageId.toUpperCase();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    openPage(item.dataset.page);

    if (window.innerWidth < 900) {
      closeSidebar();
    }
  });
});

const sidebar = document.querySelector(".sidebar");

const menuBtn = document.querySelector(".menu-btn");

const sidebarOverlay = document.getElementById("sidebarOverlay");

function closeSidebar() {
  sidebar.classList.remove("show");
  sidebarOverlay.classList.remove("show");
}

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  sidebarOverlay.classList.toggle("show");
});

sidebarOverlay.addEventListener("click", closeSidebar);

const defaultJobs = [
  {
    title: "Web Developement Intern",
    company: "PAT Technologies Pvt Limited",
    applied: "2026-02-02",
    deadline: "2026-06-02",
    status: "Saved",
    notes: "Frontend role",
  },
];

const storedJobs = localStorage.getItem("jobs");

let jobs = storedJobs !== null ? JSON.parse(storedJobs) : defaultJobs;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

const tableBody = document.getElementById("jobTableBody");

const recentApplications = document.getElementById("recentApplications");

function renderJobs() {
  tableBody.innerHTML = "";
  recentApplications.innerHTML = "";

  jobs.forEach((job, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `

      <td data-label="Role">
        <strong>${escapeHtml(job.title)}</strong>
        <br>
        ${escapeHtml(job.company)}
      </td>

      <td data-label="Status">
        <span class="status ${job.status.toLowerCase()}">
          ${job.status}
        </span>
      </td>

      <td data-label="Applied">${job.applied}</td>

      <td data-label="Deadline">${job.deadline}</td>

      <td data-label="Notes">
        <span class="notes-preview" title="${escapeHtml(job.notes)}">
          ${job.notes ? escapeHtml(job.notes) : "—"}
        </span>
      </td>

      <td data-label="Action">

        <div class="action-buttons">
          <button
          class="edit-btn"
          onclick="editJob(${index})">

            Edit

          </button>

          <button
          class="delete-btn"
          onclick="deleteJob(${index})">

            Delete

          </button>
        </div>

      </td>

    `;

    tableBody.appendChild(row);

    const card = document.createElement("div");

    card.classList.add("application-card");

    card.innerHTML = `

      <div>
        <h4>${escapeHtml(job.title)}</h4>
        <p>${escapeHtml(job.company)}</p>
        ${job.notes ? `<p class="card-notes">${escapeHtml(job.notes)}</p>` : ""}
      </div>

      <span class="status ${job.status.toLowerCase()}">
        ${job.status}
      </span>

    `;

    recentApplications.appendChild(card);
  });

  updateStats();

  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function deleteJob(index) {
  jobs.splice(index, 1);

  renderJobs();
}

function updateStats() {
  document.getElementById("totalJobs").textContent = jobs.length;

  document.getElementById("savedJobs").textContent = jobs.filter(
    (job) => job.status === "Saved",
  ).length;

  document.getElementById("appliedJobs").textContent = jobs.filter(
    (job) => job.status === "Applied",
  ).length;

  document.getElementById("interviewJobs").textContent = jobs.filter(
    (job) => job.status === "Interview",
  ).length;

  document.getElementById("offerJobs").textContent = jobs.filter(
    (job) => job.status === "Offer",
  ).length;

  document.getElementById("rejectedJobs").textContent = jobs.filter(
    (job) => job.status === "Rejected",
  ).length;
}

const modal = document.getElementById("jobModal");
const jobForm = document.getElementById("jobForm");
const modalTitle = document.getElementById("modalTitle");
const submitJobBtn = document.getElementById("submitJobBtn");

let editingIndex = null;

function openAddModal() {
  editingIndex = null;
  jobForm.reset();
  modalTitle.textContent = "NEW_RECORD";
  submitJobBtn.textContent = "SAVE";
  modal.classList.add("active");
}

function editJob(index) {
  editingIndex = index;
  const job = jobs[index];

  document.getElementById("title").value = job.title;
  document.getElementById("company").value = job.company;
  document.getElementById("appliedDate").value = job.applied;
  document.getElementById("deadline").value = job.deadline;
  document.getElementById("status").value = job.status;
  document.getElementById("notes").value = job.notes || "";

  modalTitle.textContent = "EDIT_RECORD";
  submitJobBtn.textContent = "UPDATE";
  modal.classList.add("active");
}

function closeJobModal() {
  modal.classList.remove("active");
  editingIndex = null;
  jobForm.reset();
}

document.getElementById("openModal").addEventListener("click", openAddModal);

document.getElementById("closeModal").addEventListener("click", closeJobModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeJobModal();
  }
});

jobForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const jobData = {
    title: document.getElementById("title").value,

    company: document.getElementById("company").value,

    applied: document.getElementById("appliedDate").value,

    deadline: document.getElementById("deadline").value,

    status: document.getElementById("status").value,

    notes: document.getElementById("notes").value,
  };

  if (editingIndex !== null) {
    jobs[editingIndex] = jobData;
  } else {
    jobs.unshift(jobData);
  }

  renderJobs();

  closeJobModal();
});

renderJobs();