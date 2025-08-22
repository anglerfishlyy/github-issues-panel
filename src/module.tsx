import React, { useEffect, useState } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/data';
import { Badge, Spinner } from '@grafana/ui';

type IssueLabel = { name: string };
type Issue = {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  labels?: IssueLabel[];
  updated_at: string;
  pull_request?: unknown;
};

export interface Options {
  owner: string;
  repo: string;
  state: 'open' | 'closed' | 'all';
  labels: string;      // comma-separated
  perPage: number;     // 1-50
}

const Panel: React.FC<PanelProps<Options>> = ({ options, height }) => {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { owner, repo, state, labels, perPage } = options;
    if (!owner || !repo) {
      setIssues(null);
      setErr(null); // Fix: clear error if owner/repo not set
      setLoading(false); // Fix: clear loading if owner/repo not set
      return;
    }
    const params = new URLSearchParams();
    params.set('state', state || 'open');
    if (labels) { params.set('labels', labels); }
    params.set('per_page', String(perPage || 10));

    setLoading(true);
    setErr(null);

    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?${params.toString()}`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`GitHub API ${r.status}: ${await r.text()}`);
        }
        return r.json();
      })
      .then((data: Issue[]) => {
        // Filter out PRs (issues endpoint mixes both)
        setIssues(data.filter(i => !i.pull_request));
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [options, options.owner, options.repo, options.state, options.labels, options.perPage]);

  if (!options.owner || !options.repo) {
    return <div style={{ padding: 12 }}>Set <b>Owner</b> and <b>Repository</b> in panel options.</div>;
  }
  if (loading) {
    return <div style={{ padding: 12 }}><Spinner /></div>;
  }
  if (err) {
    return <div style={{ padding: 12, color: 'var(--error-text)' }}>Error: {err}</div>;
  }
  if (!issues?.length) {
    return <div style={{ padding: 12 }}>No issues found.</div>;
  }

  return (
    <div style={{ padding: 12, overflowY: 'auto', height }}>
      {issues.map(issue => (
        <div key={issue.id} style={{ marginBottom: 10, border: '1px solid var(--border-weak)', borderRadius: 8, padding: 8 }}>
          <div style={{ fontWeight: 600 }}>#{issue.number} · {issue.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {issue.labels?.map(l => <Badge key={l.name} text={l.name} color="blue" />)}
          </div>
          <div style={{ marginTop: 4, fontSize: 12 }}>
            <a href={issue.html_url} target="_blank" rel="noreferrer">Open on GitHub</a>
            {' · '}Updated {new Date(issue.updated_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export const plugin = new PanelPlugin<Options>(Panel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'owner',
      name: 'Owner/Org',
      description: 'e.g. grafana',
      defaultValue: 'grafana',
    })
    .addTextInput({
      path: 'repo',
      name: 'Repository',
      description: 'e.g. grafana',
      defaultValue: 'grafana',
    })
    .addRadio({
      path: 'state',
      name: 'Issue state',
      defaultValue: 'open',
      settings: {
        options: [
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
          { value: 'all', label: 'All' },
        ],
      },
    })
    .addTextInput({
      path: 'labels',
      name: 'Labels (comma-separated)',
      defaultValue: '',
    })
    .addNumberInput({
      path: 'perPage',
      name: 'Max items',
      defaultValue: 10,
      settings: { min: 1, max: 50, integer: true },
    });
  });
