import * as fs from 'fs';
import * as path from 'path';
import * as https from 'http';

const REDMINE_URL = 'http://192.168.0.131:8005';
const REDMINE_HOST = '192.168.0.131';
const REDMINE_PORT = 8005;

export interface RedmineIssue {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  screenshotPath?: string;
}

export async function createRedmineIssue(issue: RedmineIssue, account: string, password: string): Promise<number | null> {
  const auth = Buffer.from(`${account}:${password}`).toString('base64');
  const body = JSON.stringify({
    issue: {
      subject: `[自動化測試] ${issue.title}`,
      description: `${issue.description}\n\n**嚴重度：** ${issue.severity}\n**發現時間：** ${new Date().toLocaleString('zh-TW')}`,
      priority_id: severityToPriority(issue.severity),
    },
  });

  return new Promise((resolve) => {
    const req = https.request({
      host: REDMINE_HOST,
      port: REDMINE_PORT,
      path: '/issues.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const issueId = parsed.issue?.id;
          console.log(`Redmine Issue 建立成功：#${issueId} - ${issue.title}`);
          resolve(issueId);
        } catch {
          console.error('Redmine 回應解析失敗：', data);
          resolve(null);
        }
      });
    });
    req.on('error', (e) => { console.error('Redmine 連線失敗：', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

function severityToPriority(severity: string): number {
  const map: Record<string, number> = { Critical: 5, High: 4, Medium: 3, Low: 2 };
  return map[severity] ?? 3;
}
